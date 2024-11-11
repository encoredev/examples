import { CreateUserDto, UpdateUserDto, Response, UserResponse, UserDto } from "./user.interface";
import { users } from "./database";
import { getOffset, paginatedData } from "./utils";

const UserService = {
  count: async (): Promise<number> => {
    const total = await users().count("id").first();
    return typeof total?.count === "string" ? parseInt(total?.count) : total?.count === undefined ? 0 : total?.count;
  },

  create: async (data: CreateUserDto): Promise<UserResponse> => {
    const [user] = await users().insert(data).returning("*");
    return {
      success: true,
      result: user,
    };
  },

  update: async (id: number, data: UpdateUserDto): Promise<UserResponse> => {
    const [updateUser] = await users().where('id', '=', id).update(data).returning("*");
    if (!updateUser) {
      return {
        success: false,
        message: "User not found",
      };
    }
    return {
      success: true,
      result: updateUser,
    }
  },

  find: async (page?: number, limit?: number): Promise<UserResponse> => {
    let pagination: any = undefined;
    let result: any[] = [];
    if (page && limit) {
      const offset = getOffset(page, limit);
      result = await users()
        .orderBy("id", "desc") // order by is mandatory
        .limit(limit) // the number of rows to return
        .offset(offset)
        .select();
      const total = await users().count().first();
      const count = typeof total?.count === "string" ? parseInt(total?.count) : total?.count === undefined ? 0 : total?.count;
      pagination = paginatedData({ size: limit, page, count: count });
    } else {
      result = await users().select();
    }
    return {
      success: true,
      result,
      pagination,
    };
  },

  findOne: async (id: number): Promise<UserResponse> => {
    const [user] = await users().where("id", "=", id).limit(1).select();
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
    const [user] = await users().where("id", "=", id).delete().returning("*");
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    return {
      success: true,
      result: "User deleted successfully",
    };
  },
};

export default UserService;
