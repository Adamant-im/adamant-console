
Command-line utilities to work with ADAMANT blockchain.

# Understanding iteraction with ADAMANT blockchain

ADAMANT node is based on Lisk 0.9 code, but with important difference. ADAMANT have *only secure API*, and you cannot transfer passphrase to node to make any action with wallet, like Lisk 0.9 does. Instead, node *requires signed transaction* to make any action.
So, to iteract with ADAMANT blockcahin, you do not need ADAMANT node installed, while you still can do that.
It is easier and better to use Adamant-console for iteractions. Adamant-console is command-line interface utility that gets command to make an action and returns result info in JSON.

You can use any programming languages to interact with Adamant-console, like PHP, Python, NodeJS, bash.

# Installing Adamant-console

The installation process described in [Console Wiki](https://github.com/Adamant-im/adamant-console/wiki/Installation).

## Configuration

System searches for config file in this location (order priority): 
~/.adm/config.json ./config.json

If no config is found, data from config.default.json is taken.

Config is in JSON format.

Data in config is merged with config.default.json, so you don't need to define already defined values, if you don't want to override them.

Config file name (config.json) can be overwritten using **ADM_CONFIG_FILENAME** environment variable.

Default config file name location (~/.adm) can be overwritten using **ADM_CONFIG_PATH** environment variable.

Current account is the one with passPhrase parameter in config.

## Commands

All commands are issued from the default account.

Commands can be used in interactive mode, or non-interactively. 

If you run console client with command it will run in non-interactive mode. 

```
adm #will run interactive mode
``` 

```
adm help #will execute help command and exit
```

### Sending tokens

To send tokens you can use *send tokens* command

#### Format

``` send tokens <address> <amount> ```

Address must be an address in ADAMANT network.  
Amount can be written in two ways. If you add ADM in amount, it will transfer needed amount of ADM tokens.
If you omit it, tool will expect you to provide it with integer amount of tokens to transfer (ADM * 100000000) 

#### Example
```
send tokens U7972131227889954319 1ADM
```


### Register delegate

To register user as delegate you can use *delegate new* command. 

#### Format

``` delegate new <name> ```

Name is delegate name you want to register with. It must be unique. It should not be similar to ADAMANT address. Delegate name can only contain alphanumeric characters with the exception of !@$&_.

Fee for registering as delegate is 3000 ADM.

#### Example
```
delegate new zero_c001
```


### Vote for delegate

To vote for delegate you can use *vote for* command 

#### Format

``` vote for <publickeys...> ```

To vote for delegate, you must provide their public keys, you can vote for 32 delegates in one command.

#### Example
```
vote for d2885bc8d4aa68f0f4c919077c1edcb9c9020a715f20cb6db7578cd6f68055bb b0b4d346382aa07b23c0b733d040424532201b9eb22004b66a79d4b44e9d1449
```
