import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import readline from 'node:readline';
import { spawn } from 'child_process';
import fs from 'fs';

const execAsync = promisify(exec);

function question(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

async function checkStripeCLI() {
  console.log(
    'Step 1: Checking if Stripe CLI is installed and authenticated...'
  );
  try {
    await execAsync('stripe --version');
    console.log('Stripe CLI is installed.');

    // Check if Stripe CLI is authenticated
    try {
      await execAsync('stripe config --list');
      console.log('Stripe CLI is authenticated.');
    } catch (error) {
      console.log(
        'Stripe CLI is not authenticated or the authentication has expired.'
      );
      console.log('Please run: stripe login');
      const answer = await question(
        'Have you completed the authentication? (y/n): '
      );
      if (answer.toLowerCase() !== 'y') {
        console.log(
          'Please authenticate with Stripe CLI and run this script again.'
        );
        process.exit(1);
      }

      // Verify authentication after user confirms login
      try {
        await execAsync('stripe config --list');
        console.log('Stripe CLI authentication confirmed.');
      } catch (error) {
        console.error(
          'Failed to verify Stripe CLI authentication. Please try again.'
        );
        process.exit(1);
      }
    }
  } catch (error) {
    console.error(
      'Stripe CLI is not installed. Please install it and try again.'
    );
    console.log('To install Stripe CLI, follow these steps:');
    console.log('1. Visit: https://docs.stripe.com/stripe-cli');
    console.log(
      '2. Download and install the Stripe CLI for your operating system'
    );
    console.log('3. After installation, run: stripe login');
    console.log(
      'After installation and authentication, please run this setup script again.'
    );
    process.exit(1);
  }
}

async function createStripeWebhook() {
  console.log('Step 4: Creating Stripe webhook...');

  const stripeProcess = spawn('stripe', [
    'listen',
    '--forward-to',
    'http://localhost:4000/v1/stripe/webhook', // Ensure correct URL
  ], {
    stdio: 'pipe',
  });

  // Capture Stripe CLI errors
  stripeProcess.stderr.on('data', async (data) => {
    const output = data.toString();
    console.log(output);

    const match = output.match(/whsec_[a-zA-Z0-9]+/);
    if (match) {
      const secret = match[0].replace("\"", "").trim();
      console.log(secret);
      console.log('Stripe webhook created:', secret);

      try {
        console.log('Setting Stripe webhook secret in Encore (local)...', secret);
        fs.writeFileSync('secret.txt', secret);
        await execAsync(`encore secret set --type local,dev StripeWebhookSecret < secret.txt`);
        fs.unlinkSync('secret.txt');
        console.log('Setting CallbackURL in Encore (local)...', 'http://localhost:3000');
        fs.writeFileSync('callback.txt', 'http://localhost:3000');
        await execAsync(`encore secret set --type local,dev CallbackURL < callback.txt`);
        fs.unlinkSync('callback.txt');
        console.log('Successfully set StripeWebhookSecret and CallbackURL in Encore secrets.');
      } catch (error) {
        console.error('Failed to set Encore secret:', error);
      }
    }
  });

  stripeProcess.on('error', (err) => {
    console.error('Failed to start Stripe listen process:', err);
  });

  stripeProcess.on('exit', (code) => {
    console.warn(`Stripe listen process exited with code ${code}`);
  });

  // Prevent script from exiting
  setInterval(() => {}, 1000);
}

async function getStripeSecretKey(): Promise<string> {
  console.log('Step 3: Getting Stripe Secret Key');
  console.log(
    'You can find your Stripe Secret Key at: https://dashboard.stripe.com/test/apikeys'
  );
  return await question('Enter your Stripe Secret Key: ');
}

async function main() {
  await checkStripeCLI();

  const STRIPE_SECRET_KEY = await getStripeSecretKey();

  // set stripe secret key in encore secrets
  try {
    console.log('Setting StripeSecretKey in Encore (local)...');
    await execAsync(`echo ${STRIPE_SECRET_KEY} | encore secret set --type local,dev StripeSecretKey`);
    console.log('Successfully set StripeSecretKey in Encore secrets.');
  } catch (error) {
    console.error('Failed to set Encore secret:', error);
    throw error;
  }

  console.log('🎉 Setup completed successfully!');
  console.log("Running stripe listen process...")
  createStripeWebhook();
}

main().catch(console.error);
