FROM 32bit/debian

RUN apt-get update
RUN apt-get -y install build-essential gdb

ARG user=joe
ARG group=joe
ARG uid=1000
ARG gid=991

# add a non-root user to test privilege escalation
RUN groupadd -g ${gid} ${group} \
    && useradd -u ${uid} -g ${gid} -m -s /bin/bash ${user}

# remove the root password
RUN passwd -d root

VOLUME /host

USER ${user}

ENTRYPOINT /bin/bash
