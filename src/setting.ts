export interface SkuAttr {
    name: string,
    key: string,
}

export interface Unit {
    name: string,
    key: string,
    data: string[]
}
export interface InitContainer {
    width: null | number,
    height: number,
    paddingTop: number,
    paddingLeft: number,
    paddingRight: number,
    paddingBottom: number,
    marginTop: number,
    marginLeft: number,
    marginRight: number,
    marginBottom: number,
}
export interface InitHeader {
    leftHeaderWidth: number,
    leftHeaderHeight: number,
}
export interface InitInput {
    width: number,
    height: number,
    padding: number,
    marginTop: number,
    marginLeft: number,
    borderRadius: number,
    borderColor: string,
    activeBorderColor: string,
    textColor: string,
    activeTextColor: string,
}
export interface InitSetting {
  container:InitContainer,
  header: InitHeader,
  input: InitInput
}

export interface InitParams {
    skuAttr: SkuAttr[],
    unit: Unit[],
    setting: InitSetting
}
export function initSetting ({unit,skuAttr,setting}:InitParams) {
    let originUnit: Unit[] = []
    let originskuAttr: SkuAttr[] = []
    let originSetting:InitSetting = {
        // canvas 样式配置项
        container: {
          width: null,
          height: 800,
          paddingTop: 0,
          paddingLeft: 80,
          paddingRight: 0,
          paddingBottom: 0,
          marginTop: 0,
          marginLeft: 50,
          marginRight: 0,
          marginBottom: 0,
        },
        header: {
          leftHeaderWidth: 50,
          leftHeaderHeight: 60,
        },
        input: {
          width: 200,
          height: 40,
          padding: 0,
          marginTop: 20,
          marginLeft: 20,
          borderRadius: 0,
          borderColor: "#dcdee2",
          activeBorderColor: "#57a3f3",
          textColor: "#515a6e",
          activeTextColor: "#515a6e",
        },
      };
    return {
    
    }
}