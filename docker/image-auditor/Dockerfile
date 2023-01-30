FROM node:19
COPY src /opt/app 
WORKDIR /opt/app/
EXPOSE 2205
ENTRYPOINT ["node", "/opt/app/app.js"]
RUN npm install