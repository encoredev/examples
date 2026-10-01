import { randomUUID } from "node:crypto";
import { api, APIError } from "encore.dev/api";
import { db } from "./db";

export interface CreateAppointmentParams {
  customerName: string;
  phone: string;
  startsAt: Date;
  remindAt: Date;
}

export interface AppointmentResponse {
  id: string;
  reminderID: string;
  status: string;
}

export const createAppointment = api(
  { expose: true, method: "POST", path: "/appointments" },
  async (params: CreateAppointmentParams): Promise<AppointmentResponse> => {
    if (!params.phone.startsWith("+") || params.phone.length < 8) {
      throw APIError.invalidArgument("phone must use E.164 format");
    }
    if (params.remindAt >= params.startsAt) {
      throw APIError.invalidArgument("remindAt must be before startsAt");
    }

    const appointmentID = randomUUID();
    const reminderID = randomUUID();
    const tx = await db.begin();
    try {
      await tx.exec`
        INSERT INTO appointments (id, customer_name, phone, starts_at)
        VALUES (${appointmentID}, ${params.customerName}, ${params.phone}, ${params.startsAt})
      `;
      await tx.exec`
        INSERT INTO reminders (id, appointment_id, due_at)
        VALUES (${reminderID}, ${appointmentID}, ${params.remindAt})
      `;
      await tx.commit();
    } catch (error) {
      await tx.rollback();
      throw error;
    }

    return { id: appointmentID, reminderID, status: "scheduled" };
  },
);

export const cancelAppointment = api(
  { expose: true, method: "POST", path: "/appointments/:id/cancel" },
  async ({ id }: { id: string }): Promise<{ status: string }> => {
    const row = await db.queryRow<{ id: string }>`
      UPDATE appointments
      SET status = 'cancelled'
      WHERE id = ${id} AND status = 'scheduled'
      RETURNING id
    `;
    if (!row) throw APIError.notFound("scheduled appointment not found");

    await db.exec`
      UPDATE reminders
      SET status = 'skipped', updated_at = NOW()
      WHERE appointment_id = ${id} AND status IN ('pending', 'queued')
    `;
    return { status: "cancelled" };
  },
);

export const rescheduleAppointment = api(
  { expose: true, method: "POST", path: "/appointments/:id/reschedule" },
  async ({ id, startsAt, remindAt }: { id: string; startsAt: Date; remindAt: Date }): Promise<{ status: string }> => {
    if (remindAt >= startsAt) {
      throw APIError.invalidArgument("remindAt must be before startsAt");
    }

    const tx = await db.begin();
    try {
      const row = await tx.queryRow<{ id: string }>`
        UPDATE appointments
        SET starts_at = ${startsAt}
        WHERE id = ${id} AND status = 'scheduled'
        RETURNING id
      `;
      if (!row) throw APIError.notFound("scheduled appointment not found");
      await tx.exec`
        UPDATE reminders
        SET due_at = ${remindAt}, status = 'pending', bird_message_id = NULL,
            accepted_at = NULL, last_error = NULL, updated_at = NOW()
        WHERE appointment_id = ${id}
      `;
      await tx.commit();
    } catch (error) {
      await tx.rollback();
      throw error;
    }
    return { status: "rescheduled" };
  },
);

export interface AppointmentState {
  id: string;
  customerName: string;
  phone: string;
  startsAt: Date;
  status: string;
  reminder: {
    id: string;
    dueAt: Date;
    status: string;
    birdMessageID: string | null;
    attempts: number;
    lastError: string | null;
  };
}

interface AppointmentRow {
  id: string;
  customer_name: string;
  phone: string;
  starts_at: Date;
  appointment_status: string;
  reminder_id: string;
  due_at: Date;
  reminder_status: string;
  bird_message_id: string | null;
  attempt_count: number;
  last_error: string | null;
}

function toAppointmentState(row: AppointmentRow): AppointmentState {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    startsAt: row.starts_at,
    status: row.appointment_status,
    reminder: {
      id: row.reminder_id,
      dueAt: row.due_at,
      status: row.reminder_status,
      birdMessageID: row.bird_message_id,
      attempts: row.attempt_count,
      lastError: row.last_error,
    },
  };
}

export const listAppointments = api(
  { expose: true, method: "GET", path: "/appointments" },
  async (): Promise<{ appointments: AppointmentState[] }> => {
    const rows = await db.queryAll<AppointmentRow>`
      SELECT a.id, a.customer_name, a.phone, a.starts_at,
             a.status AS appointment_status, r.id AS reminder_id,
             r.due_at, r.status AS reminder_status,
             r.bird_message_id, r.attempt_count, r.last_error
      FROM appointments a
      JOIN reminders r ON r.appointment_id = a.id
      ORDER BY a.created_at DESC
      LIMIT 50
    `;
    return { appointments: rows.map(toAppointmentState) };
  },
);

export const getAppointment = api(
  { expose: true, method: "GET", path: "/appointments/:id" },
  async ({ id }: { id: string }): Promise<AppointmentState> => {
    const row = await db.queryRow<AppointmentRow>`
      SELECT a.id, a.customer_name, a.phone, a.starts_at,
             a.status AS appointment_status, r.id AS reminder_id,
             r.due_at, r.status AS reminder_status,
             r.bird_message_id, r.attempt_count, r.last_error
      FROM appointments a
      JOIN reminders r ON r.appointment_id = a.id
      WHERE a.id = ${id}
    `;
    if (!row) throw APIError.notFound("appointment not found");
    return toAppointmentState(row);
  },
);
