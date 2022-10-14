# QMK Layer Notification

This is layer notification for QMK Keyboard / firmware.
Notification pop-up will show each time layer changes.
![alt text](https://github.com/geneshairzan/qmk_layer_notification/blob/master/demo/sample.png?raw=true)
> iam really expecting you and community to improve this repo since i think this is the the first and only solution for qmk layer notification (instead using screen / lcd) by now.

# Quick Features

- Made using node and other supporting library
- Notification pop-up will show each time layer changes.
- Plug / un-Plug detection

# Installation & Instruction

split in 3 step (qmk code, QMK Layer Notification, node application management)

## QMK code

prerequisite [QMK debuging](https://github.com/mafintosh/prebuild)

1. put `#include "print.h"` on top your `keymap.c`
2. put `uprintf("SOME DYNAMIC LAYER CHANGES");` in `keymap.c`, somewhere in your layer shift code
3. my example :

```c
#include "print.h"
...
bool process_record_user(uint16_t keycode, keyrecord_t* record) {
     switch (keycode) {
           case KC_CYCLE_LAYERS: // custom macro
            if (record->event.pressed) {
                   // SEND_STRING("I love QMK with VIA!");
                selected_layer++;
                if (selected_layer > 3) {
                       selected_layer = 0;
                }
                layer_clear();
                layer_on(selected_layer);
                uprintf("layer%u", selected_layer);
            }
            break;
    }
    return true;
}

```

5. Check if the debug already running :

>**Debugging With hid_listen**
Something stand-alone? [hid_listed](https://www.pjrc.com/teensy/hid_listen.html), provided by PJRC, can also be used to display debug messages. Prebuilt binaries for Windows,Linux,and MacOS are available.

## QMK Layer Notification

prerequisite. [Node and NPM](https://nodejs.org/en/download/). google it how to have in your computer. there is ton of resources out there.

1. clone this repo
2. install depedency `npm i`
3. check the result of your HID list on your device `node list`
4. find your device, and edit config.js accordingly.
example somewhere in result

```js
[
  ...
  {
    vendorId: 28263,
    productId: 8499,
    path: '\\\\?\\hid#vid_6e67&pid_2133&mi_02&col01#7&2e040053&0&0000#{4d1e55b2-f16f-11cf-88cb-001111000030}',
    manufacturer: 'nguyedt',
    product: 'Bento',
    release: 256,
    interface: 2,
    usagePage: 1,
    usage: 128
  },
  ...
  {
    vendorId: 28263,
    productId: 8499,
    path: '\\\\?\\hid#vid_6e67&pid_2133&mi_01#7&1ad3e415&0&0000#{4d1e55b2-f16f-11cf-88cb-001111000030}',
    manufacturer: 'nguyedt',
    product: 'Bento',
    release: 256,
    interface: 1,
    usagePage: 65376,
    usage: 97
  }
]
```

**GLITCH1**. somehow, sometimes, this resulting multiple (array) device with same vendorId & productId. index in `config.device` use to **manually** select which device that will monitor using it index (start from 0).  **StUpiDly** try which index to use/monitor, one by one (at least for now).

then i put that information into `config.js`.

```
export const device = {
  vid: 28263, //vendorId
  pid: 8499, //productId
  index: 1, // 0 - ~
};
```

5. Test the aplication `node index`

## Application Management

this will make the aplication run at startup, auto restart on crash, etc. read more [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/)

1. install pm2 `npm i pm2 -g`
2. register the application `pm2 start index.js --name qmk_layer_notification`
3. save confif `pm2 save`

## Notes

- This is barely functional notification pop-up
- Iam still found glitch / bug there and there
- Only tested in windows for now (teorytically applicatible in other OS)

## ToDev

- GLITCH1. how efficiently selected which device to monitor
- put the code inside installer (ie. electoron) and make other people use easier.
- improve notification UI message & mapping. like, "Layer - Default" , "Layer - OBS", etc
- dynamic config reference for different user/config thru args or other method
- resource optimization ?

## Depedency

[node-hid](https://github.com/node-hid/node-hid)
[node-notifier](https://github.com/mikaelbr/node-notifier)
[node-usb-detection](https://github.com/MadLittleMods/node-usb-detection)
