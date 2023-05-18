const express = require("express");
const paypal = require("paypal-rest-sdk");
const cors = require("cors");

paypal.configure({
  mode: "sandbox", // Cambia a 'live' en producción
  client_id:
    "AdlXlGE1MvbMXzsWC_bTfdlgL5Yb104KWoc-zv53teX6UM2UQANZ1s-EJ0WuS-JuFFtB8io1dtWG_u9h",
  client_secret:
    "EJreDO5j5ZPyAgCHIBEFdC9EaMmn84Q1HdDQm5DNyXL27KvUIj7yX7VDo5J82RdcPzWJT0XaRgukQCC9",
});

// const auth = {client_id, client_secret}
const app = express();
app.use(cors()); // Es importante para que Paypal tb realice una petición a nuestro server
// Ruta para crear un pago
app.post("/crear-pago", (req, res) => {
  const payment = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/pago-completado",
      cancel_url: "http://localhost:3000/pago-cancelado",
    },
    transactions: [
      {
        amount: {
          total: "10.00",
          currency: "USD",
        },
        description: "Compra de prueba",
      },
    ],
  };

  paypal.payment.create(payment, (error, paymentData) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      const { links } = paymentData;
      const approvalUrl = links.find(
        (link) => link.rel === "approval_url"
      ).href;
      res.json({ approvalUrl });
    }
  });
});

// Ruta para ejecutar un pago
app.get("/ejecutar-pago", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const executePayment = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "10.00",
        },
      },
    ],
  };

  paypal.payment.execute(paymentId, executePayment, (error, paymentData) => {
    // req.query -> token ?token=oi23nmpj298341298hph28r5
    if (error) {
      console.error(error);
      res.redirect("/pago-error");
    } else {
      // Pago completado exitosamente
      res.redirect("/pago-completado");
    }
  });
});
app.get("/pago-completado", (req, res)=>{
    
    res.redirect('http://127.0.0.1:5173/')
})
app.listen(3000, () => {
  console.log("Servidor Express escuchando en el puerto http://localhost:3000");
});
