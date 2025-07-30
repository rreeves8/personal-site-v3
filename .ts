class TreeNode {
  children = new Array<TreeNode>();
  constructor(public name: string) {}
}

function simplifyPath(path: string): string {
  const chars = [];

  if (path[0] !== "/") {
    chars.push("/");
  }

  for (let i = 0; i < path.length; i++) {
    const char = path[i];

    if (chars.length === 0) {
      chars.push(char);
      continue;
    }

    if (char === "/") {
      if (chars[chars.length - 1] !== "/") {
        chars.push(chars);
      }
    }

    if (char === ".") {
      if (path[i + 1] !== "/") {
        i += 1;
      }
      chars.push(chars);
    }
  }

  return chars.join("");
}
const t = ["/home//foo/", "/.../a/../b/c/../d/./"];

console.log(t.map((c) => simplifyPath(c)));
