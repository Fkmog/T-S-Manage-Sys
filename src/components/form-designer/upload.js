import FcDesigner from "@form-create/designer";
import NewUp from "./up.vue";
formCreate.component("NewUp", NewUp);

const label = " 上传";
const name = "newUp";
let i = 1;
const uniqueId = () => `uni${i++}`;

export const newUp = {
  //拖拽组件的图标
  icon: "icon-upload",
  //拖拽组件的名称
  label,
  //拖拽组件的 key
  name,
  //拖拽组件的生成规则
  rule() {
    //如果在 props 方法中需要修改 rule 的属性,需要提前在 rule 上定义对应的属性
    return {
      component: NewUp,
      //生成组件的名称
      type: name,
      //field 自定不能重复,所以这里每次都会生成一个新的
      field: uniqueId(),
      title: label,
      info: "",
      effect: {
        fetch: "",
      },
      //这里设置组件的默认props配置项, 在下面的 props 方法里面设置无效
      props: {
        action: "",
        onSuccess(res, file) {
          file.url = res.data.url;
        },
      },
    };
  },
  //拖拽组件配置项(props)的生成规则
  props() {
    return [
      //生成`checkbox`组件的`options`配置规则
      FcDesigner.makeOptionsRule("options"),
      {
        type: "select",
        field: "uploadType",
        value: "image",
        title: "上传类型",
        options: [
          { label: "图片", value: "image" },
          {
            label: "文件",
            value: "file",
          },
        ],
      },
      {
        type: "switch",
        field: "disabled",
        title: "是否禁用",
      },
    ];
  },
};
