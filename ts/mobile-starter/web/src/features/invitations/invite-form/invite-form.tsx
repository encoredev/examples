import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInviteForm } from "./invite-form.hooks";

interface InviteFormProps {
	onSuccess?: () => void;
}

export function InviteForm({ onSuccess }: InviteFormProps) {
	const { form, isLoading, error, success, handleSubmit } =
		useInviteForm(onSuccess);

	const {
		register,
		formState: { errors },
	} = form;

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<h3 className="font-semibold text-text">Invite a member</h3>

			{error && (
				<div className="rounded-lg border border-error/30 bg-error-muted p-3 text-sm text-error">
					{error}
				</div>
			)}

			{success && (
				<div className="rounded-lg border border-success/30 bg-success-muted p-3 text-sm text-success">
					{success}
				</div>
			)}

			<div className="flex gap-3">
				<div className="flex-1">
					<Label htmlFor="invite-email">Email</Label>
					<Input
						id="invite-email"
						type="email"
						placeholder="colleague@example.com"
						{...register("email")}
						className="mt-1"
					/>
					{errors.email && (
						<p className="mt-1 text-sm text-error">{errors.email.message}</p>
					)}
				</div>

				<div className="w-32">
					<Label htmlFor="invite-role">Role</Label>
					<select
						id="invite-role"
						{...register("role")}
						className="mt-1 flex w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-ring"
					>
						<option value="member">Member</option>
						<option value="admin">Admin</option>
					</select>
				</div>

				<div className="flex items-end">
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Sending..." : "Invite"}
					</Button>
				</div>
			</div>
		</form>
	);
}
