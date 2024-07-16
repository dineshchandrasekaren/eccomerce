import { Router } from "express";
import { getByParams } from "../middlewares/params.middleware";
import { SCHEMA_IDS } from "../constants";

const router = Router();

router.param("categoryId", getByParams(SCHEMA_IDS.Category));
