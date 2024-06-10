import { order } from "./lib.js";
import { device } from "./config.js";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import HID from "node-hid";
import notifier from "node-notifier";
import usbDetect from "usb-detection";

const __dirname = dirname(fileURLToPath(import.meta.url));

listener();

usbDetect.startMonitoring();
usbDetect.on(`add:${device.vid}`, listener);
usbDetect.on(`remove:${device.vid}`, async function (d) {
  await doNotify("Qmk Disconnected");
});

function listener() {
  setTimeout(async function () {
    doNotify("Qmk Connected");
    const devices = HID.devices()
      .filter((d) => d.vendorId == device.vid && d.productId == device.pid && d.usage == device.usage)
      .sort(order);
    let active = new HID.HID(devices[device.index].path);

    active.on("data", function (data) {
      doNotify(data.toString());
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
