export function getNameTypeTenant(type: string): string {
  let name: string;

  switch (type) {
    case "subitem":
      name = "Área do Cliente/Sub-Instância";
      break;
    case "agency":
      name = "Agência";
      break;
    case "agencytrial":
      name = "Agência Teste Grátis";
      break;
    case "brands":
      name = "Brands";
      break;
    case "brandstrial":
      name = "Brands Teste Grátis";
      break;
    case "":
      name = "Institucional";
      break;
    default:
      name = type;
      break;
  }

  return name;
}

export function getMeasure(type: string): string {
  let name: string;

  switch (type) {
    case "px":
      name = "Pixels";
      break;
    case "m":
      name = "Metros";
      break;
    case "cm":
      name = "Centímetros";
      break;
    default:
      name = type;
      break;
  }

  return name;
}

export const unmaskMoney = (
  raw: string,
  onlyNumber = false
): string | number => {
  if (!raw) return onlyNumber ? 0 : "";

  // 1) remove espaços, símbolo de moeda e caracteres inválidos
  let val = raw.replace(/\s|\u00A0/g, "").replace(/[^0-9,.-]/g, "");

  // 2) encontra último separador (vírgula ou ponto)
  const lastComma = val.lastIndexOf(",");
  const lastDot = val.lastIndexOf(".");
  const decIdx = Math.max(lastComma, lastDot);

  let intPart = "";
  let fracPart = "";

  if (decIdx >= 0) {
    intPart = val.slice(0, decIdx);
    fracPart = val.slice(decIdx + 1);
  } else {
    intPart = val;
  }

  // 3) limpa parte inteira (remove pontos e vírgulas)
  intPart = intPart.replace(/[.,]/g, "");

  // 4) mantém só dígitos na fração e limita a 2 casas
  fracPart = fracPart.replace(/\D/g, "").slice(0, 2);

  if (onlyNumber) {
    // retorna como número real (float)
    const numStr =
      fracPart.length > 0
        ? `${intPart}.${fracPart.padEnd(2, "0")}`
        : intPart || "0";
    const num = parseFloat(numStr);
    return isNaN(num) ? 0 : num;
  } else {
    // retorna centavos como string de dígitos
    const cents = (intPart || "0") + fracPart.padEnd(2, "0");
    return cents.replace(/^0+(?=\d)/, "") || "0";
  }
};
