# PulseWire

PulseWire is a Pulsar API plugin that implements real-time communications powered by socket.io as a feature for Pulsar. It is also the official Pulsar API plugin sample application.

PulseWire is a plugin solely because Pulsar needed a plugin sample to go along with its plugin API. So, I killed two birds with one stone and built Pulsar's real-time communications system as an optional plugin. Admins who want PulseWire simply enable it and set some options. Admins who don't simply disable it and don't ever have to think about it.

## Installation

PulseWire is included with Pulsar. If you have Pulsar, you have the PulseWire plugin. It just might not be enabled.

## Usage

To enable PulseWire:

1. Visit your Pulsar instance's admin dashboard
2. Go to the Plugins tab
3. For the PulseWire plugin, click "Enable"
4. Set the options you want and click the Apply button

Once enabled, all users currently logged into Pulsar will begin seeing new features such as chat and other real-time messaging applications.

## Sample Appliction
PulseWire is Pulsar's "official" plugin sample application. It creates a basic model and exposes REST endpoints to service the model. It makes full use of Pulsar's socket.io framework. And, once Constellation arrives, that means your plugin can automatically support routed Pulsar messages allowing users on different Pulsar instances to communicate in real time.

Pulsar plugin developers are strongly encouraged to consier the PulseWire plugin to be the current reference sample application. If the Pulsar Plugin framework offers a feature, this plugin will show you the current best practice on using that feature to its maximum benefit.
