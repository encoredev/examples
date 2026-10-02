import {api} from "encore.dev/api";
import {toNodeHandler} from "better-auth/node";
import {auth} from "../encore.service";

export const authRouter = api.raw(
    {
        expose: true,
        path: "/api/auth/*params",
        method: "*",
    },
    async (req, res) => {
        const authRouter = toNodeHandler(auth);
        authRouter(req, res)
            .then((result) => {
                res.end(result)
            })
            .catch((error) => {
                console.error(error);
                res.statusCode = 500;
                res.end("Internal Server Error");
            })
    }
)