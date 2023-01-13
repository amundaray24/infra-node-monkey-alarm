FROM node:18.13.0 as builder

#INSTALING PIGPIO AND SUDO
RUN apt-get update
RUN apt-get install -y python-setuptools python3-setuptools sudo

WORKDIR /tmp

RUN wget https://github.com/joan2937/pigpio/archive/master.zip
RUN unzip master.zip

WORKDIR /tmp/pigpio-master

RUN make
RUN make install


#CONFIG NODE USER AND SUDO
RUN chpasswd && adduser node sudo

RUN echo '%sudo ALL = NOPASSWD:ALL' >> /etc/sudoers

#INIT APP LOAD AND NPM INSTALL
FROM builder

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

USER root

CMD [ "node", "src/index.js"]