# Testing toy exploits for 32-bit Linux on x86

Useful reading
* The Shellcoder's Handbook
* Smashing the Stack for Fun and Profit

```bash
# build the latest image
docker build -t hack .

# run a container in the foreground
docker run --rm  --ulimit core=-1 -h hack -e HIST_FILE=/home/joe/.bash_history -v "$(pwd)/.bash_history:/home/joe/.bash_history" -v $(pwd):/host -it hack

# ssh (assuming there is one running container)
# add -u 0 to ssh as root
docker exec -it $(docker ps | fgrep hack | tail -1 | cut -d" " -f1) bash

```

* Disable ASLR so every process gets the same stack address (requires Docker `--privileged` mode): `echo 0 > /proc/sys/kernel/randomize_va_space`
* Compile with `-mpreferred-stack-boundary=2` to align stack pointers to 4 byte boundaries
