import { Construct } from 'constructs';
import { App, TerraformStack } from 'cdktf';
import {KubernetesProvider, Namespace, Deployment, Service} from './.gen/providers/kubernetes';

function createDeployment(stack: TerraformStack, appName: string) {
  const dep = new Deployment(stack, `${appName}-deployment`, {
    metadata: [{ name: appName }]
  })
}

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ks8 = new KubernetesProvider(this, "test-k8s")

    const app
    // define resources here

  }
}

const app = new App();
new MyStack(app, 'terraform-cdk-sample');
app.synth();
