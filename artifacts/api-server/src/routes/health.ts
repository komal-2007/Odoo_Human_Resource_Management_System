import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { checkDatabaseConnection } from "@workspace/db";

const router: IRouter = Router();

router.get("/healthz", async (_req, res) => {
  const database = await checkDatabaseConnection();
  const data = HealthCheckResponse.parse({
    status: database ? "ok" : "degraded",
    database,
  });
  res.status(database ? 200 : 503).json({ ...data, database });
});

export default router;
