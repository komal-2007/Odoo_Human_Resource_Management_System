import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import employeesRouter from "./employees";
import leaveRouter from "./leave";
import attendanceRouter from "./attendance";
import payrollRouter from "./payroll";


const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(employeesRouter);
router.use(leaveRouter);
router.use(attendanceRouter);
router.use(payrollRouter);

export default router;
