import subprocess

context_map = {
    "staging": "kind-iot-staging",
    "production": "kind-iot-production",
    "argocd": "kind-iot-argocd",
}


def switch_context(environment):
    if environment in context_map:
        context = context_map[environment]
        switch_context_command = f"kubectl config use-context {context}"
        subprocess.run(switch_context_command, shell=True, check=True)
    else:
        raise ValueError(f"Unknown environment: {environment}")
