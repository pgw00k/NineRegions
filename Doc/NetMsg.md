# NetMsg
## ShopBuy 相关前置
在使用商店时，需要先初始化充值信息，需要在 `NetMsg_EnterGame/NetMsg_MainTownReconnect/NetMsg_Pay_SN` 中的返回体中带上`PayInfo` 字段，这样才会触发`RechargeMgr.UpdateRechargeInfoByNet` 函数对`RechargeMgr.combineCostMap` 进行初始化，否则会因为`RechargeMgr.combineCostMap` 为空，导致出现 nil 异常从而导致商店的后续购买逻辑失效。
> 第一次购买可能会成功，或者使用仙玉（`jade`）购买会成功，其他购买会因为检测组合消费而失败。
