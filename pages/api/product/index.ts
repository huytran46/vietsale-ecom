import { BaseReponse } from "models/common/BaseResponse";
import { Product } from "models/Product";
import { parse, stringifyUrl } from "query-string";
import fetcher from "services/config";
import withSession from "utils/session";

export default withSession(async (req, res) => {
  const uri = stringifyUrl({ url: "/public/product", query: req.query });
  try {
    const result = await fetcher.get<BaseReponse<{ products: Product[] }>>(uri);

    if (!result.data) {
      return res.status(500).json({});
    }
    const products = result.data.data.products;
    if (products) return res.json(products);
    return res.status(404).json({ error: "Not found" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});
