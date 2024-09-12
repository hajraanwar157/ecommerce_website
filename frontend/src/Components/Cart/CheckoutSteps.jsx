import { Step, StepLabel, Stepper, Typography } from "@mui/material";
import {
  LocalShipping,
  LibraryAddCheck,
  AccountBalance,
} from "@mui/icons-material";
import "./CheckoutSteps.css";
function CheckoutSteps({ activeStep }) {
  const steps = [
    {
      label: <Typography>Shipping details</Typography>,
      icon: <LocalShipping />,
    },
    {
      label: <Typography>Confirm order</Typography>,
      icon: <LibraryAddCheck />,
    },
    {
      label: <Typography>Payment</Typography>,
      icon: <AccountBalance />,
    },
  ];
  const stepStyles = {
    boxSizing: "border-box",
  };
  return (
    <>
      <div className="checkout-stepper">
        <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
          {steps.map((item, index) => (
            <Step
              key={index}
              active={activeStep === index ? true : false}
              completed={activeStep >= index ? true : false}
            >
              <StepLabel
                icon={item.icon}
                style={{
                  color: activeStep >= index ? "tomato" : "rgba(0,0,0,0.649)",
                }}
              >
                {item.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
    </>
  );
}

export default CheckoutSteps;
