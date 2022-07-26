FROM node:14.19.1


SHELL [ "/bin/bash", "-c" ]

USER node

WORKDIR /home/node/app

COPY --chown=node package.json ./

RUN npm install

USER node
COPY --chown=node . .

RUN chmod +x docker/entrypoint.sh
ENTRYPOINT docker/entrypoint.sh

EXPOSE 3001

CMD npm start