FROM 32bit/debian

RUN apt-get update
RUN apt-get -y install build-essential gdb

ARG user=joe
ARG group=joe
ARG uid=1000
ARG gid=991

RUN groupadd -g ${gid} ${group} \
    && useradd -u ${uid} -g ${gid} -m -s /bin/bash ${user}

VOLUME /host

USER ${user}

ENTRYPOINT /bin/bash
