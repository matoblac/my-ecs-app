# my-ecs-app

A minimal Node.js app ready for AWS SDK, Express, and Docker.

```bash
git clone https://github.com/matoblac/my-ecs-app.git
cd my-ecs-app
npm install
npm run build
npm start
# or for Docker:
docker build -t my-ecs-app .
docker run -p 3000:3000 my-ecs-app
```