# Resolve 4.2
FROM node:18-slim

ARG TAG_VERSION=1.0.0

ENV BUILD_VERSION=$TAG_VERSION

WORKDIR /usr/src/app

# Resolves CIS 4.9
COPY package*.json ./

RUN npm install

# Resolves CIS 4.9
COPY . .

RUN npm run build

# Resolve 4.3: No dependency/package installed

# Resolve CIS 4.8
# Should be run before changing user to nobody
#RUN find / -perm /6000 -type f -exec chmod a-s {} \; || true

EXPOSE 9020

# Resolves CIS 4.1
#USER nobody

# Resolve CIS 4.6 HEALTHCHECK
#HEALTHCHECK CMD curl --fail http://localhost:9020/api/healthcheck || exit 1

ENTRYPOINT [ "sh", "-c", "npm start 2>&1 | tee /var/log/application.log" ]
#CMD ["npm", "start"]
