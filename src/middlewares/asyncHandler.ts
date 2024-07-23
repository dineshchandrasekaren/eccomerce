import { Request, Response, NextFunction } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

export const asyncHandler =
  (controller: AsyncFunction) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };

//   import { Request, Response, NextFunction } from "express";

// type AsyncFunction = (
//   req: Request,
//   res: Response,
//   next?: NextFunction
// ) => Promise<void>;

// export const asyncHandler = (
//   target: any,
//   propertyName: string,
//   descriptor: PropertyDescriptor
// ): PropertyDescriptor => {
//   const originalMethod = descriptor.value;

//   descriptor.value = async function(req: Request, res: Response, next: NextFunction) {
//     try {
//       await originalMethod.apply(this, [req, res, next]);
//     } catch (error) {
//       next(error);
//     }
//   };

//   return descriptor;
// };
