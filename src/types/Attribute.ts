type HWCAttributeValue = {
  id: string;
  name: string;
};

type HWCAttributeBase = {
  id: string;
  name: string;
  is_for_variations: boolean;
};

type HWCColorAttribute = HWCAttributeBase & {
  type: "color";
  values: (HWCAttributeValue & { color: string })[];
};

type HWCImageAttribute = HWCAttributeBase & {
  type: "image";
  values: (HWCAttributeValue & { imageUrl: string })[];
};

type HWCSelectAttribute = HWCAttributeBase & {
  type: "select";
  values: HWCAttributeValue[];
};

export type HWCAttribute =
  | HWCColorAttribute
  | HWCImageAttribute
  | HWCSelectAttribute;
