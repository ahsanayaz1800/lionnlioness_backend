bashCopy code
FROM node:14
WORKDIR /routes/server.js
COPY . /routes/server.js
RUN npm install
ENV PORT 8080
EXPOSE 8080
CMD ["npm", "start"]
