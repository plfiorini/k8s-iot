#!/bin/bash

set -e

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 [cluster_name]"
    exit 1
fi

cluster_name="$1"

# Create a Kubernetes cluster using kind
if ! kind get clusters | grep -q $cluster_name; then
    kind create cluster --name $cluster_name
fi

# Install Helm if not already installed
if ! command -v helm &> /dev/null; then
    echo "Helm could not be found, installing..."
    curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
fi

# Set context to the newly created cluster
kubectl config use-context kind-$cluster_name

# Create namespaces
kubectl apply -f namespaces.yaml
