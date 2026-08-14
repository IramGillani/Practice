import * as WebhookService from "../services/webhookService";
import { asyncHandler } from "../utils/asyncHandler";

export const handleStripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).send("Missing stripe-signature header");
  }

  const event = WebhookService.verifyStripeSignature(
    req.body as Buffer,
    signature as string,
  );
  console.log(event);

  await WebhookService.processWebhookEvent(event);

  return res.status(200).json({
    received: true,
  });
});
