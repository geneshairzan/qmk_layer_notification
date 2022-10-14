import { order } from "./lib.js";
import { device } from "./config.js";
import path from "path";
import HID from "node-hid";
import WindowsToaster from "node-notifier";
import usbDetect from "usb-detection";

listener();

usbDetect.startMonitoring();
usbDetect.on(`add:${device.vid}`, listener);
usbDetect.on(`remove:${device.vid}`, async function (d) {
  await doNotify("Qmk Disconnected");
});

function listener() {
  setTimeout(async function () {
    doNotify("Qmk Connected ");
    const devices = HID.devices()
      .filter((d) => d.vendorId == device.vid && d.productId == device.pid)
      .sort(order);
    let active = new HID.HID(devices[device.index].path);

    active.on("data", function (data) {
      doNotify(data.toString());
    });
  }, 100);
}

var notifier = new WindowsToaster.WindowsToaster({
  withFallback: false,
  customPath: undefined,
});

async function doNotify(v) {
  notifier.notify({
    title: "My notification",
    message: v,
    icon: path.join("icon.png"),
    sound: false,
    id: 212,
    appID: "qmk-bento",
  });
}
