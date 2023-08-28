import FcDesigner from "@form-create/designer";
import Cookies from "js-cookie";
import upload from "./upload.vue";
import { localeProps, makeRequiredRule } from "./utils";
import { shallowRef } from "vue";
import store from "@/store/index.js";
const label = " 上传";
const name = "upload";
const classId = store.state.currentInfo;
let i = 1;
const uniqueId = () => `uni${i++}`;
export const uploadRule = {
  //拖拽组件的图标
  icon: "icon-upload",
  //拖拽组件的名称
  label,
  //拖拽组件的 key
  name: upload,
  //拖拽组件的生成规则
  rule() {
    //如果在 props 方法中需要修改 rule 的属性,需要提前在 rule 上定义对应的属性
    return {
      component: shallowRef(upload),
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
        action: "http://81.68.103.96:8099/common/upload/file",
        headers: { Authorization: "Bearer " + Cookies.get("Admin-Token") },
        data: [
          {
            // param: id,W
            type: "workbookFile",
          },
        ],
        onSuccess(res) {
          console.log("suc");
        },
      },
    };
  },
  //拖拽组件配置项(props)的生成规则
  props(_, { t }) {
    return localeProps(t, name + ".props", [
      makeRequiredRule(),
      // {
      //   type: "select",
      //   field: "uploadType",
      //   title: "上传类型",
      //   value: "image",
      //   options: [
      //     { label: "图片", value: "image" },
      //     {
      //       label: "文件",
      //       value: "file",
      //     },
      //   ],
      // },
      { type: "switch", field: "multiple", title: "是否支持多选文件" },
      {
        type: "switch",
        field: "disabled",
        title: "是否禁用",
      },
      {
        type: "inputNumber",
        field: "limit",
        title: "最大允许上传个数",
        props: { min: 0 },
      },
    ]);
  },
};
export function helloword() {
  return console.log("123",classId);
}
