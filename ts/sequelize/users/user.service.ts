import { CreateUserDto, UpdateUserDto, Response, UserResponse, Paginated } from "./user.interface";
import { User } from "./user.model";
import { getOffset, paginatedData } from "./utils";

const UserService = {
  count: async (): Promise<number> => {
    const count = await User.count();
    return count;
  },

  create: async (data: CreateUserDto): Promise<UserResponse> => {
    const user = await User.create(data);
    return {
      success: true,
      result: user.toJSON(),
    };
  },

  update: async (id: number, data: UpdateUserDto): Promise<UserResponse> => {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    user.name = data.name || user.name;
    user.surname = data.surname || user.surname;
    const updated = await user.save();
    return {
      success: true,
      result: updated.toJSON(),
    };
  },

  find: async (page?: number, limit?: number): Promise<UserResponse> => {
    let users: User[] = [];
    let pagination: any = undefined;
    if (page && limit) {
      const offset = getOffset(page, limit);
      const data = await User.findAndCountAll({ limit, offset });
      users = data.rows;
      pagination = paginatedData({ size: limit, page, count: data.count });
    } else {
      users = await User.findAll();
    }
    return {
      success: true,
      result: users.map((user) => user.toJSON()),
      pagination,
    };
  },

  findOne: async (id: number): Promise<UserResponse> => {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    return {
      success: true,
      result: user.toJSON(),
    };
  },

  delete: async (id: number): Promise<Response> => {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    await user.destroy();
    return {
      success: true,
      result: "User deleted successfully",
    };
  },
};

export default UserService;
