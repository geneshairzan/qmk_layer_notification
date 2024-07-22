import { order } from "./lib.js";
import { device } from "./config.js";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import HID from "node-hid";
import notifier from "node-notifier";
import { usb } from "usb";

const __dirname = dirname(fileURLToPath(import.meta.url));

listener();

usb.on("attach", function (d) {
  if (d.deviceDescriptor.idVendor === device.vid
    && d.deviceDescriptor.idProduct === device.pid) {
    listener();
  }
});
usb.on("detach", async function (d) {
  if (d.deviceDescriptor.idVendor === device.vid
    && d.deviceDescriptor.idProduct === device.pid) {
    await doNotify("Device Disconnected");
  }
});

function listener() {
  setTimeout(async function () {
    doNotify("Device Connected");
    const devices = HID.devices()
      .filter((d) => d.vendorId == device.vid && d.productId == device.pid && d.usage == device.usage)
      .sort(order);
    let active = new HID.HID(devices[device.index].path);

    active.on("data", function (data) {
      doNotify(data.toString());
    });

    //handle device error (such as the device being unplugged), otherwise HID will panic and the app will crash
    active.on("error", function(err) {
      console.log(err)
    });
  }, 100);
}

async function doNotify(v) {
  notifier.notify({
    title: "QMK Notifier",
    message: v,
    icon: join(__dirname, "icon.png"),
    sound: false,
    id: 212,
    appID: "qmk-bento",
    timeout: 2
  });
}
