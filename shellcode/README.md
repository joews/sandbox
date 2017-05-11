# Testing toy exploits for 32-bit Linux on x86

Code samples based on The Shellcoder's Handbook

```bash
docker build -t hack:latest
docker run --rm --privileged -h hack -v $(pwd)/.bash_history:/root/.bash_history -v $(pwd):/host -it hack

# disable ASLR
3eef5db806ff:/host# echo 0 > /proc/sys/kernel/randomize_va_space
```

* Disable ASLR so every process gets the same stack address (requires Docker `--privileged` mode)
* Compile with `-mpreferred-stack-boundary=2` to align stack pointers to 4 byte boundaries
