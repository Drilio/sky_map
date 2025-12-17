FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm install --global serve

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4000"]
