#!/bin/bash

set -e

cluster_name="${1:-iot-cluster}"
namespace="iot"

# Create a Kubernetes cluster using kind
if ! kind get clusters | grep -q $cluster_name; then
    kind create cluster --name $cluster_name
fi

# Install Helm if not already installed
if ! command -v helm &> /dev/null; then
    echo "Helm could not be found, installing..."
    curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
fi

# Create namespaces
kubectl apply -f namespaces.yaml
