import { Document, Model, Query } from "mongoose";
import { IBigQ } from "../types/whereClause";
import { IProduct } from "../types/product";

class WhereClause<T extends Document = IProduct> {
  public base: Query<T[], T>;

  constructor(public bigQ: IBigQ, public model: Model<T>) {
    this.base = this.model.find();
  }

  search() {
    this.base = this.base.find(
      this.bigQ.search
        ? {
            name: { $regex: this.bigQ.search, $options: "i" },
          }
        : {}
    );
    return this;
  }

  filter() {
    const copyQ = { ...this.bigQ };

    delete copyQ["page"];
    delete copyQ["limit"];
    delete copyQ["search"];

    const stringOfCopyQ = JSON.stringify(copyQ);
    stringOfCopyQ.replace(/\b(gte|lte|gt|lt)\b/, (q) => `$${q}`);

    const jsonOfCopyQ = JSON.parse(stringOfCopyQ);

    this.base = this.base.find(jsonOfCopyQ);
    return this;
  }

  pagination(resultPerPage: number) {
    const { page = 1 } = this.bigQ;

    const skipPerPage = resultPerPage * (page - 1);

    this.base = this.base.limit(resultPerPage).skip(skipPerPage);
    return this;
  }
}
export default WhereClause;
