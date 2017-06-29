# kubernetes on mac

Tested on macOS 10.12.4

## Install

From https://kubernetes.io/docs/tasks/tools/install-minikube/:

* install xkyve driver
* install kubectl
* install minikube

## Run

```bash
# start a local one-node cluster
minikube start --vm-driver=xhyve

# check the cluster is up
kubectl get nodes

# deploy a pod with a single container, using an image from Google's container registry
 kubectl run hello-minikube --image=gcr.io/google_containers/echoserver:1.4 --port=8080

 # expose the app on a random port on the node's own public IP
kubectl expose deployment hello-minikube --type=NodePortkubectl expose deployment hello-minikube --type=NodePort

# check if the pod is running yet
kubectl get pod

# open the app on the Node's IP in a browser:
minikube service hello-minikube

# do the same with curl
curl $(minikube service hello-minikube --url)

# open the kubernetes dashboard
minikube dashboard

# run an example job to completion
kubectl create -f ./job.yaml

# check the job status
kubectl describe jobs/pi

# stop the cluster
minikube stop
```
