 
// src/routes/indexRoute.ts

// src/routes/indexRoute.ts
import { Router } from "express";
import { systemRoutes } from "./systemRoutes";

const indexRoute = Router();

indexRoute.use("/system", systemRoutes);

export { indexRoute };



// import { Router } from "express";
// import { systemRoutes } from "./systemRoutes";

// const router = Router();

// router.use("/system", systemRoutes);

// export { router as indexRoute };
