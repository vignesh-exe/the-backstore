import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "react-email";
import * as React from "react";

type OrderShippedEmailProps = {
  fullName: string;
  orderNumber: string;
  trackingId: string;
};

export default function OrderShippedEmail({
  fullName,
  orderNumber,
  trackingId,
}: OrderShippedEmailProps) {
  const firstName = fullName.trim().split(/\s+/)[0] || "there";

  const previewText = `Your Backstore order ${orderNumber} is on the way.`;

  return (
    <Html lang="en" dir="ltr">
      <Head />

      <Preview>{previewText}</Preview>

      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#080808",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <Container
          style={{
            width: "100%",
            maxWidth: "620px",
            margin: "0 auto",
            backgroundColor: "#111111",
          }}
        >
          {/* HEADER */}
          <Section
            style={{
              padding: "28px 36px",
              backgroundColor: "#080808",
              borderBottom: "1px solid #252525",
            }}
          >
            <Img
              src="https://thebackstore.in/logo/backstore-logo.png"
              alt="The Backstore"
              width="150"
              style={{
                display: "block",
                margin: "0 auto",
              }}
            />

            <Text
              style={{
                margin: "7px 0 0",
                color: "#666362",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.14em",
              }}
            >
              SHIPPING UPDATE
            </Text>
          </Section>

          {/* HERO */}
          <Section
            style={{
              padding: "42px 36px 36px",
              backgroundColor: "#111111",
            }}
          >
            <Text
              style={{
                margin: 0,
                color: "#DA0D12",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.18em",
              }}
            >
              ORDER SHIPPED
            </Text>

            <Heading
              style={{
                margin: "12px 0 0",
                color: "#CBCAC8",
                fontSize: "34px",
                lineHeight: "1.05",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              YOUR ORDER
              <br />
              IS ON THE WAY.
            </Heading>

            <Text
              style={{
                margin: "20px 0 0",
                color: "#8A8886",
                fontSize: "14px",
                lineHeight: "1.7",
              }}
            >
              Hey {firstName}, your Backstore order has left our hands and is
              now making its way to you.
            </Text>
          </Section>

          {/* ORDER CARD */}
          <Section
            style={{
              padding: "0 36px",
              backgroundColor: "#111111",
            }}
          >
            <Section
              style={{
                padding: "24px",
                backgroundColor: "#181818",
                borderLeft: "3px solid #DA0D12",
              }}
            >
              <Text
                style={{
                  margin: 0,
                  color: "#666362",
                  fontSize: "9px",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                ORDER NUMBER
              </Text>

              <Text
                style={{
                  margin: "8px 0 0",
                  color: "#CBCAC8",
                  fontSize: "20px",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                }}
              >
                #{orderNumber}
              </Text>
            </Section>
          </Section>

          {/* STATUS */}
          <Section
            style={{
              padding: "28px 36px 0",
              backgroundColor: "#111111",
            }}
          >
            <Text
              style={{
                margin: 0,
                color: "#666362",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "0.15em",
              }}
            >
              DELIVERY STATUS
            </Text>

            <Section
              style={{
                marginTop: "12px",
                padding: "18px 20px",
                backgroundColor: "#181818",
                border: "1px solid #252525",
              }}
            >
              <Text
                style={{
                  margin: 0,
                  color: "#DA0D12",
                  fontSize: "15px",
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                }}
              >
                ● SHIPPED
              </Text>

              <Text
                style={{
                  margin: "8px 0 0",
                  color: "#8A8886",
                  fontSize: "12px",
                  lineHeight: "1.6",
                }}
              >
                Your package has been handed over for delivery.
              </Text>
            </Section>
          </Section>

          {/* TRACKING */}
          <Section
            style={{
              padding: "24px 36px 0",
              backgroundColor: "#111111",
            }}
          >
            <Text
              style={{
                margin: 0,
                color: "#666362",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "0.15em",
              }}
            >
              TRACKING ID
            </Text>

            <Section
              style={{
                marginTop: "10px",
                padding: "16px 18px",
                backgroundColor: "#080808",
                border: "1px solid #252525",
              }}
            >
              <Text
                style={{
                  margin: 0,
                  color: "#CBCAC8",
                  fontSize: "14px",
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  wordBreak: "break-all",
                }}
              >
                {trackingId}
              </Text>
            </Section>
          </Section>

          {/* JOURNEY */}
          <Section
            style={{
              padding: "32px 36px 0",
              backgroundColor: "#111111",
            }}
          >
            <Text
              style={{
                margin: 0,
                color: "#666362",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "0.15em",
              }}
            >
              THE JOURNEY
            </Text>

            <Section
              style={{
                marginTop: "14px",
                padding: "20px",
                backgroundColor: "#181818",
              }}
            >
              <Text
                style={{
                  margin: 0,
                  color: "#CBCAC8",
                  fontSize: "12px",
                  fontWeight: 800,
                }}
              >
                ORDER PLACED
              </Text>

              <Text
                style={{
                  margin: "5px 0 14px",
                  color: "#666362",
                  fontSize: "10px",
                }}
              >
                ✓ Order confirmed
              </Text>

              <Text
                style={{
                  margin: 0,
                  color: "#DA0D12",
                  fontSize: "12px",
                  fontWeight: 900,
                }}
              >
                SHIPPING
              </Text>

              <Text
                style={{
                  margin: "5px 0 14px",
                  color: "#8A8886",
                  fontSize: "10px",
                }}
              >
                ● Your order is on the way
              </Text>

              <Text
                style={{
                  margin: 0,
                  color: "#666362",
                  fontSize: "12px",
                  fontWeight: 800,
                }}
              >
                DELIVERY
              </Text>

              <Text
                style={{
                  margin: "5px 0 0",
                  color: "#666362",
                  fontSize: "10px",
                }}
              >
                Coming up next
              </Text>
            </Section>
          </Section>

          {/* CTA */}
          <Section
            style={{
              padding: "32px 36px 40px",
              textAlign: "center",
              backgroundColor: "#111111",
            }}
          >
            <Button
              href="https://thebackstore.in/orders"
              style={{
                display: "inline-block",
                padding: "14px 24px",
                backgroundColor: "#DA0D12",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.08em",
                textDecoration: "none",
              }}
            >
              TRACK MY ORDER →
            </Button>

            <Text
              style={{
                margin: "18px 0 0",
                color: "#666362",
                fontSize: "10px",
                lineHeight: "1.6",
              }}
            >
              Keep your tracking ID handy for delivery updates.
            </Text>
          </Section>

          {/* FOOTER */}
          <Hr
            style={{
              margin: 0,
              border: 0,
              borderTop: "1px solid #252525",
            }}
          />

          <Section
            style={{
              padding: "24px 36px",
              backgroundColor: "#080808",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                margin: 0,
                color: "#DA0D12",
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: "0.16em",
              }}
            >
              THE BACKSTORE
            </Text>

            <Text
              style={{
                margin: "8px 0 0",
                color: "#666362",
                fontSize: "9px",
                lineHeight: "1.6",
              }}
            >
              BOLD TEES. OVERSIZED FITS. ORIGINAL STREETWEAR.
              <br />
              MADE WITH ❤️ IN CHENNAI.
            </Text>

            <Text
              style={{
                margin: "14px 0 0",
                color: "#444240",
                fontSize: "8px",
              }}
            >
              © The Backstore. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
