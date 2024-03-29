import { BaseReponse } from "models/common/BaseResponse";
import { Product } from "models/Product";
import fetcher from "services/config";
import withSession from "utils/session";

export default withSession(async (req, res) => {
  const { pid } = req.query;
  if (!pid) return res.status(404).json({ error: "Bad request" });
  const uri = `/public/product/${pid}/related`;
  try {
    const result = await fetcher.get<BaseReponse<{ products: Product[] }>>(uri);
    if (!result.data) {
      return res.status(500).json({});
    }
    const product = result.data.data.products;
    if (product) return res.json(product);
    return res.status(404).json({ error: "Not found" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});
