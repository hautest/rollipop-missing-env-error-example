# Rollipop 미정의 환경변수 오류 재현

[English](./README.md)

정의되지 않은 `import.meta.env` 변수를 읽으면 `undefined`를 반환하는 대신
런타임에서 `TypeError`가 발생합니다.

Node.js 24.12.0 이상과 pnpm이 필요합니다. 네이티브 앱이나 기기 없이 재현할 수 있습니다.

```sh
pnpm install
pnpm repro
```

게시된 `rollipop@1.0.0-alpha.33` 패키지를 사용합니다.
로컬 Rollipop 저장소나 별도 패치는 필요하지 않습니다.

진입 파일의 코드는 다음 두 줄입니다.

```js
console.log('MODE:', import.meta.env.MODE);
console.log('MISSING:', import.meta.env.ROLLIPOP_MISSING);
```

`.env` 파일은 필요하지 않습니다. `ROLLIPOP_MISSING`은 의도적으로 정의하지 않았습니다.

기대 결과:

```text
MODE: production
MISSING: undefined
```

실제 결과:

```text
MODE: production
TypeError: Cannot read properties of undefined (reading 'ROLLIPOP_MISSING')
```

`pnpm repro`는 먼저 `rollipop bundle`로 빌드한 뒤, 생성된 `dist/index.cjs`를
Node로 실행합니다. 빌드는 성공하지만 실행은 종료 코드 1로 실패합니다.
생성된 번들에는 다음 코드가 포함됩니다.

```js
console.log("MODE:", "production");
console.log("MISSING:", {}.env.ROLLIPOP_MISSING);
```

설정의 플러그인은 번들을 Node에서 실행할 수 있도록 React Native 초기화 코드인
prelude와 polyfill만 제거합니다. 환경변수나 환경변수 변환 동작은 변경하지 않습니다.

Rollipop의 [환경변수 문서](https://github.com/rollipop-dev/rollipop/blob/8d3347118ebe7b8c0efa8e6b1f7e878cd702d68f/docs/content/docs/features/env.mdx)에서도
노출되지 않은 변수를 읽으면 `undefined`를 반환한다고 안내합니다.

Node.js 24.12.0, pnpm 11.22.0, Rollipop 1.0.0-alpha.33,
@rollipop/rolldown 1.0.32 환경에서 재현을 확인했습니다.
