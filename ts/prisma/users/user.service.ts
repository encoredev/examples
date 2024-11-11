import { prisma } from "./database";
import {
  CreateUserDto,
  UpdateUserDto,
  Response,
  UserResponse,
} from "./user.interface";
import { type User } from "./user.model";
import { getOffset, paginatedData } from "./utils";

const UserService = {
  count: async (): Promise<number> => {
    const count = await prisma.user.count();
    return count;
  },

  create: async (data: CreateUserDto): Promise<UserResponse> => {
    const user = await prisma.user.create({ data });
    return {
      success: true,
      result: user,
    };
  },

  update: async (id: number, data: UpdateUserDto): Promise<UserResponse> => {
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    user.name = data.name || user.name;
    user.surname = data.surname || user.surname;
    const updated = await prisma.user.update({ data: user, where: { id } });
    return {
      success: true,
      result: updated,
    };
  },

  find: async (page?: number, limit?: number): Promise<UserResponse> => {
    let users: User[] = [];
    let pagination: any = undefined;
    if (page && limit) {
      const offset = getOffset(page, limit);
      const count = await prisma.user.count();
      users = await prisma.user.findMany({ take: limit, skip: offset });
      pagination = paginatedData({ size: limit, page, count });
    } else {
      users = await prisma.user.findMany();
    }
    return {
      success: true,
      result: users.map((user) => user),
      pagination,
    };
  },

  findOne: async (id: number): Promise<UserResponse> => {
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    return {
      success: true,
      result: user,
    };
  },

  delete: async (id: number): Promise<Response> => {
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    await prisma.user.delete({ where: { id } });
    return {
      success: true,
      result: "User deleted successfully",
    };
  },
};

export default UserService;
