import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "react-email";

type WelcomeEmailProps = {
  fullName: string;
};

export default function WelcomeEmail({ fullName }: WelcomeEmailProps) {
  const firstName = fullName.trim().split(/\s+/)[0] || "there";

  return (
    <Html lang="en">
      <Head />

      <Preview>Your Backstore account is ready, {firstName}.</Preview>

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
          {/* Top red strip */}
          <Section
            style={{
              height: "6px",
              backgroundColor: "#DA0D12",
            }}
          />

          {/* Header */}
          <Section
            style={{
              padding: "34px 36px 28px",
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
                margin: "18px 0 0",
                textAlign: "center",
                color: "#666362",
                fontSize: "9px",
                fontWeight: "700",
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              ACCOUNT REGISTRATION CONFIRMED
            </Text>
          </Section>

          {/* Hero */}
          <Section
            style={{
              padding: "54px 36px 40px",
              textAlign: "center",
              backgroundColor: "#0D0D0D",
            }}
          >
            <Text
              style={{
                margin: "0 0 14px",
                color: "#DA0D12",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "4px",
                textTransform: "uppercase",
              }}
            >
              YOU&apos;RE IN.
            </Text>

            <Heading
              style={{
                margin: 0,
                color: "#CBCAC8",
                fontSize: "46px",
                lineHeight: "0.95",
                fontWeight: "900",
                letterSpacing: "-1px",
              }}
            >
              WELCOME TO THE
              <br />
              <span style={{ color: "#DA0D12" }}>BACKSTORE FAMILY.</span>
            </Heading>

            <Text
              style={{
                maxWidth: "430px",
                margin: "26px auto 0",
                color: "#8A8886",
                fontSize: "14px",
                lineHeight: "1.8",
              }}
            >
              Hey {firstName},
              <br />
              your Backstore account has been successfully created.
            </Text>

            <Text
              style={{
                maxWidth: "450px",
                margin: "14px auto 0",
                color: "#666362",
                fontSize: "13px",
                lineHeight: "1.8",
              }}
            >
              Your account is now ready. You can sign in with the email address
              you used during registration and manage your profile, orders and
              account details from your Backstore account.
            </Text>
          </Section>

          {/* Account confirmation */}
          <Section
            style={{
              margin: "0 36px",
              padding: "30px 24px",
              backgroundColor: "#181818",
              borderLeft: "3px solid #DA0D12",
            }}
          >
            <Text
              style={{
                margin: "0 0 10px",
                color: "#DA0D12",
                fontSize: "9px",
                fontWeight: "700",
                letterSpacing: "3px",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              ACCOUNT STATUS
            </Text>

            <Text
              style={{
                margin: 0,
                color: "#CBCAC8",
                fontSize: "18px",
                lineHeight: "1.5",
                fontWeight: "700",
                textAlign: "center",
                letterSpacing: "0.5px",
              }}
            >
              YOUR ACCOUNT IS
              <br />
              <span style={{ color: "#DA0D12" }}>READY TO USE.</span>
            </Text>
          </Section>

          {/* CTA */}
          <Section
            style={{
              padding: "42px 36px 48px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                margin: "0 0 22px",
                color: "#666362",
                fontSize: "11px",
                lineHeight: "1.7",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              You can access your account anytime.
            </Text>

            <Button
              href="https://thebackstore.in/account"
              style={{
                display: "inline-block",
                padding: "15px 28px",
                backgroundColor: "#DA0D12",
                color: "#FFFFFF",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "2px",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              GO TO MY ACCOUNT →
            </Button>
          </Section>

          {/* Footer */}
          <Section
            style={{
              padding: "26px 36px 30px",
              borderTop: "1px solid #252525",
              textAlign: "center",
              backgroundColor: "#0B0B0B",
            }}
          >
            <Text
              style={{
                margin: 0,
                color: "#444240",
                fontSize: "9px",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              ACCOUNT CONFIRMATION
            </Text>

            <Text
              style={{
                margin: "10px 0 0",
                color: "#DA0D12",
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "3px",
              }}
            >
              THE BACKSTORE
            </Text>

            <Text
              style={{
                margin: "14px 0 0",
                color: "#333333",
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
