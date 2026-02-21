 
// src/routes/indexRoute.ts

// src/routes/indexRoute.ts
import { Router } from "express";
import { systemRoutes } from "./systemRoutes";
import { authRoute } from "../use-cases/auth";

const indexRoute = Router();

indexRoute.use("/system", systemRoutes);
indexRoute.use("/auth", authRoute);

export { indexRoute };



// import { Router } from "express";
// import { systemRoutes } from "./systemRoutes";

// const router = Router();

// router.use("/system", systemRoutes);

// export { router as indexRoute };
