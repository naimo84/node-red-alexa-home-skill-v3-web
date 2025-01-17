FROM node:16

ENV NODE_ENV production

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .

CMD ["npm", "start"]

EXPOSE 3000