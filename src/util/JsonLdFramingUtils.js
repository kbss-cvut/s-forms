import jsonld from "jsonld";
import Constants from "../constants/Constants";
import FormUtils from "../util/FormUtils";
import Utils from "./Utils";

const formShape = {
  root: {
    [Constants.HAS_LAYOUT_CLASS]: Constants.FORM,
  },
  expandProperties: [
    Constants.HAS_SUBQUESTION,
    Constants.IS_RELEVANT_IF,
    Constants.HAS_ANSWER,
    Constants.HAS_DECLARED_PREFIX,
    Constants.HAS_OPTION,
    Constants.HAS_COMMENT,
  ],
};

export default class JsonLdFramingUtils {
  //TODO revise

  /**
   * Performs JSON-LD custom framing using shapes. Shape is declaration of the JSON-LD framing
   * in a language that is incompatible with JSON-LD specification.
   *
   * @param input the JSON-LD input to framing by a shape.
   * @param shape the JSON-LD custom frame configuration using shapes.
   * @param callback(err, framed) called once the operation completes.
   */
  static customFrame(input, shape, callback) {
    if (arguments.length < 2) {
      return jsonld.nextTick(function () {
        callback(new TypeError("Could not frame, too few arguments."));
      });
    }

    if (shape === null) {
      //TODO remove
      shape = formShape;
    }

    let flattened = null;
    let err = null;
    const flattenedCallback = (e, f) => {
      flattened = f;
      err = e;
    };

    jsonld.flatten(input, null, null, flattenedCallback);
  }

  static expandStructure(structure) {
    let root;
    const id2objectMap = {}; // mapping @id -> object

    structure["@graph"].forEach((item) => {
      id2objectMap[item["@id"]] = item;

      if (FormUtils.isForm(item)) {
        root = item;
      }
    });

    try {
      this._expandGraph(root, formShape, id2objectMap);
    } catch (e) {
      console.error(
        "Error '" +
          e +
          "' occured, while trying to apply frame-ing with custom shape."
      );
    }

    return id2objectMap;
  }

  static _expandGraph(parentNode, shape, id2ObjectMap) {
    let childArray;
    let child;
    let childId;

    shape.expandProperties.forEach((prop) => {
      if (parentNode.hasOwnProperty(prop)) {
        parentNode[prop] = Utils.asArray(parentNode[prop]);
        childArray = parentNode[prop];

        for (let i = 0; i < childArray.length; i++) {
          childId = this._getId(childArray[i]);
          child = id2ObjectMap[childId];

          if (child !== undefined) {
            childArray[i] = child;
            //console.log(childId + " expanded.");
            this._expandGraph(child, shape, id2ObjectMap);
          } else {
            console.warn(
              "object with @id " + childId + " was not defined in input data."
            );
          }
        }
      }
    });
  }

  static _getId(jsonObject) {
    if (typeof jsonObject === "string") {
      return jsonObject;
    }
    return jsonObject["@id"];
  }

  static compressStructure = (rootNode) => {
    let object2IdMap = []; // mapping object -> id
    let idIncluded = new Set();

    object2IdMap = this._compressGraph(rootNode, object2IdMap, idIncluded);

    object2IdMap = object2IdMap.sort((a, b) => {
      if (a["@id"] && b["@id"]) {
        return a["@id"].localeCompare(b["@id"]);
      }
      return 0;
    });

    return object2IdMap;
  };

  static _compressGraph = (parentNode, object2IdMap, idIncluded) => {
    if (!idIncluded.has(parentNode["@id"])) {
      object2IdMap.push(parentNode);
      idIncluded.add(parentNode["@id"]);
    }

    formShape.expandProperties.forEach((prop) => {
      if (parentNode.hasOwnProperty(prop)) {
        const childArray = parentNode[prop];

        for (let i = 0; i < childArray.length; i++) {
          const child = childArray[i];

          if (child !== undefined) {
            childArray[i] = child;

            object2IdMap = this._compressGraph(child, object2IdMap, idIncluded);

            parentNode[prop][i] = { "@id": child["@id"] };
          }
        }
      }
    });

    return object2IdMap;
  };
}
