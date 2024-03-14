require("dotenv").config();
const jsonServer = require("json-server");
const morgan = require("morgan");
const {OpenAI} = require("openai")
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const PORT = process.env.PORT;
server.use(jsonServer.bodyParser)


const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

server.use(middlewares);
server.use(morgan("dev"));

server.post("/ai/image-generator", async (req, res) => {
  try {
    console.log(req.body)
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${req.body.prompt}`,
      n: 1,
      size: "1024x1024",
    });
    console.log("This is all of OpenAI response", response.data[0].url);
    console.log("This is the data ==>", response.data[0].url);
    return res.status(200).json(response.data[0].url)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
});
server.use((req, res, next) => {
  // Middleware to disable CORS
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running at port ${PORT}`);
});
