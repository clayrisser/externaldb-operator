/*


Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package v1alpha1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// EDIT THIS FILE!  THIS IS SCAFFOLDING FOR YOU TO OWN!
// NOTE: json tags are required.  Any new fields you add must have json tags for the fields to be serialized.

// ConnectionPostgresSpec defines the desired state of ConnectionPostgres
type ConnectionPostgresSpec struct {
	// postgres hostname
	Hostname string `json:"foo,omitempty"`

	// postgres port
	Port int64 `json:"foo,omitempty"`

	// postgres username
	Username string `json:"foo,omitempty"`

	// postgres password
	Password string `json:"foo,omitempty"`

	// postgres database name
	Database string `json:"foo,omitempty"`

	// postgres connection url
	Url string `json:"foo,omitempty"`

	// secret name containing `POSTGRES_PASSWORD` or `POSTGRES_CONNECITON_URL`
	SecretName string `json:"foo,omitempty"`

	// config map name containing `POSTGRES_HOSTNAME`, `POSTGRES_PORT`, `POSTGRES_USERNAME` or `POSTGRES_DATABASE`
	ConfigMapName string `json:"foo,omitempty"`
}

// ConnectionPostgresStatus defines the observed state of ConnectionPostgres
type ConnectionPostgresStatus struct {
	// INSERT ADDITIONAL STATUS FIELD - define observed state of cluster
	// Important: Run "make" to regenerate code after modifying this file
}

// +kubebuilder:object:root=true
// +kubebuilder:subresource:status

// ConnectionPostgres is the Schema for the connectionpostgres API
type ConnectionPostgres struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   ConnectionPostgresSpec   `json:"spec,omitempty"`
	Status ConnectionPostgresStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// ConnectionPostgresList contains a list of ConnectionPostgres
type ConnectionPostgresList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []ConnectionPostgres `json:"items"`
}

func init() {
	SchemeBuilder.Register(&ConnectionPostgres{}, &ConnectionPostgresList{})
}
