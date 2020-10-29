// +build !ignore_autogenerated

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

// Code generated by controller-gen. DO NOT EDIT.

package v1alpha1

import (
	runtime "k8s.io/apimachinery/pkg/runtime"
	"sigs.k8s.io/kustomize/api/types"
)

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ConnectionMongo) DeepCopyInto(out *ConnectionMongo) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ObjectMeta.DeepCopyInto(&out.ObjectMeta)
	out.Spec = in.Spec
	out.Status = in.Status
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ConnectionMongo.
func (in *ConnectionMongo) DeepCopy() *ConnectionMongo {
	if in == nil {
		return nil
	}
	out := new(ConnectionMongo)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *ConnectionMongo) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ConnectionMongoList) DeepCopyInto(out *ConnectionMongoList) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ListMeta.DeepCopyInto(&out.ListMeta)
	if in.Items != nil {
		in, out := &in.Items, &out.Items
		*out = make([]ConnectionMongo, len(*in))
		for i := range *in {
			(*in)[i].DeepCopyInto(&(*out)[i])
		}
	}
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ConnectionMongoList.
func (in *ConnectionMongoList) DeepCopy() *ConnectionMongoList {
	if in == nil {
		return nil
	}
	out := new(ConnectionMongoList)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *ConnectionMongoList) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ConnectionMongoSpec) DeepCopyInto(out *ConnectionMongoSpec) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ConnectionMongoSpec.
func (in *ConnectionMongoSpec) DeepCopy() *ConnectionMongoSpec {
	if in == nil {
		return nil
	}
	out := new(ConnectionMongoSpec)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ConnectionMongoStatus) DeepCopyInto(out *ConnectionMongoStatus) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ConnectionMongoStatus.
func (in *ConnectionMongoStatus) DeepCopy() *ConnectionMongoStatus {
	if in == nil {
		return nil
	}
	out := new(ConnectionMongoStatus)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ConnectionMysql) DeepCopyInto(out *ConnectionMysql) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ObjectMeta.DeepCopyInto(&out.ObjectMeta)
	out.Spec = in.Spec
	out.Status = in.Status
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ConnectionMysql.
func (in *ConnectionMysql) DeepCopy() *ConnectionMysql {
	if in == nil {
		return nil
	}
	out := new(ConnectionMysql)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *ConnectionMysql) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ConnectionMysqlList) DeepCopyInto(out *ConnectionMysqlList) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ListMeta.DeepCopyInto(&out.ListMeta)
	if in.Items != nil {
		in, out := &in.Items, &out.Items
		*out = make([]ConnectionMysql, len(*in))
		for i := range *in {
			(*in)[i].DeepCopyInto(&(*out)[i])
		}
	}
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ConnectionMysqlList.
func (in *ConnectionMysqlList) DeepCopy() *ConnectionMysqlList {
	if in == nil {
		return nil
	}
	out := new(ConnectionMysqlList)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *ConnectionMysqlList) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ConnectionMysqlSpec) DeepCopyInto(out *ConnectionMysqlSpec) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ConnectionMysqlSpec.
func (in *ConnectionMysqlSpec) DeepCopy() *ConnectionMysqlSpec {
	if in == nil {
		return nil
	}
	out := new(ConnectionMysqlSpec)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ConnectionMysqlStatus) DeepCopyInto(out *ConnectionMysqlStatus) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ConnectionMysqlStatus.
func (in *ConnectionMysqlStatus) DeepCopy() *ConnectionMysqlStatus {
	if in == nil {
		return nil
	}
	out := new(ConnectionMysqlStatus)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ConnectionPostgres) DeepCopyInto(out *ConnectionPostgres) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ObjectMeta.DeepCopyInto(&out.ObjectMeta)
	out.Spec = in.Spec
	out.Status = in.Status
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ConnectionPostgres.
func (in *ConnectionPostgres) DeepCopy() *ConnectionPostgres {
	if in == nil {
		return nil
	}
	out := new(ConnectionPostgres)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *ConnectionPostgres) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ConnectionPostgresList) DeepCopyInto(out *ConnectionPostgresList) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ListMeta.DeepCopyInto(&out.ListMeta)
	if in.Items != nil {
		in, out := &in.Items, &out.Items
		*out = make([]ConnectionPostgres, len(*in))
		for i := range *in {
			(*in)[i].DeepCopyInto(&(*out)[i])
		}
	}
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ConnectionPostgresList.
func (in *ConnectionPostgresList) DeepCopy() *ConnectionPostgresList {
	if in == nil {
		return nil
	}
	out := new(ConnectionPostgresList)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *ConnectionPostgresList) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ConnectionPostgresSpec) DeepCopyInto(out *ConnectionPostgresSpec) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ConnectionPostgresSpec.
func (in *ConnectionPostgresSpec) DeepCopy() *ConnectionPostgresSpec {
	if in == nil {
		return nil
	}
	out := new(ConnectionPostgresSpec)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ConnectionPostgresStatus) DeepCopyInto(out *ConnectionPostgresStatus) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ConnectionPostgresStatus.
func (in *ConnectionPostgresStatus) DeepCopy() *ConnectionPostgresStatus {
	if in == nil {
		return nil
	}
	out := new(ConnectionPostgresStatus)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ExternalMongo) DeepCopyInto(out *ExternalMongo) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ObjectMeta.DeepCopyInto(&out.ObjectMeta)
	out.Spec = in.Spec
	out.Status = in.Status
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ExternalMongo.
func (in *ExternalMongo) DeepCopy() *ExternalMongo {
	if in == nil {
		return nil
	}
	out := new(ExternalMongo)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *ExternalMongo) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ExternalMongoList) DeepCopyInto(out *ExternalMongoList) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ListMeta.DeepCopyInto(&out.ListMeta)
	if in.Items != nil {
		in, out := &in.Items, &out.Items
		*out = make([]ExternalMongo, len(*in))
		for i := range *in {
			(*in)[i].DeepCopyInto(&(*out)[i])
		}
	}
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ExternalMongoList.
func (in *ExternalMongoList) DeepCopy() *ExternalMongoList {
	if in == nil {
		return nil
	}
	out := new(ExternalMongoList)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *ExternalMongoList) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ExternalMongoSpec) DeepCopyInto(out *ExternalMongoSpec) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ExternalMongoSpec.
func (in *ExternalMongoSpec) DeepCopy() *ExternalMongoSpec {
	if in == nil {
		return nil
	}
	out := new(ExternalMongoSpec)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ExternalMongoStatus) DeepCopyInto(out *ExternalMongoStatus) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ExternalMongoStatus.
func (in *ExternalMongoStatus) DeepCopy() *ExternalMongoStatus {
	if in == nil {
		return nil
	}
	out := new(ExternalMongoStatus)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ExternalMysql) DeepCopyInto(out *ExternalMysql) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ObjectMeta.DeepCopyInto(&out.ObjectMeta)
	out.Spec = in.Spec
	out.Status = in.Status
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ExternalMysql.
func (in *ExternalMysql) DeepCopy() *ExternalMysql {
	if in == nil {
		return nil
	}
	out := new(ExternalMysql)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *ExternalMysql) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ExternalMysqlList) DeepCopyInto(out *ExternalMysqlList) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ListMeta.DeepCopyInto(&out.ListMeta)
	if in.Items != nil {
		in, out := &in.Items, &out.Items
		*out = make([]ExternalMysql, len(*in))
		for i := range *in {
			(*in)[i].DeepCopyInto(&(*out)[i])
		}
	}
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ExternalMysqlList.
func (in *ExternalMysqlList) DeepCopy() *ExternalMysqlList {
	if in == nil {
		return nil
	}
	out := new(ExternalMysqlList)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *ExternalMysqlList) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ExternalMysqlSpec) DeepCopyInto(out *ExternalMysqlSpec) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ExternalMysqlSpec.
func (in *ExternalMysqlSpec) DeepCopy() *ExternalMysqlSpec {
	if in == nil {
		return nil
	}
	out := new(ExternalMysqlSpec)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ExternalMysqlStatus) DeepCopyInto(out *ExternalMysqlStatus) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ExternalMysqlStatus.
func (in *ExternalMysqlStatus) DeepCopy() *ExternalMysqlStatus {
	if in == nil {
		return nil
	}
	out := new(ExternalMysqlStatus)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ExternalPostgres) DeepCopyInto(out *ExternalPostgres) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ObjectMeta.DeepCopyInto(&out.ObjectMeta)
	in.Spec.DeepCopyInto(&out.Spec)
	out.Status = in.Status
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ExternalPostgres.
func (in *ExternalPostgres) DeepCopy() *ExternalPostgres {
	if in == nil {
		return nil
	}
	out := new(ExternalPostgres)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *ExternalPostgres) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ExternalPostgresList) DeepCopyInto(out *ExternalPostgresList) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ListMeta.DeepCopyInto(&out.ListMeta)
	if in.Items != nil {
		in, out := &in.Items, &out.Items
		*out = make([]ExternalPostgres, len(*in))
		for i := range *in {
			(*in)[i].DeepCopyInto(&(*out)[i])
		}
	}
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ExternalPostgresList.
func (in *ExternalPostgresList) DeepCopy() *ExternalPostgresList {
	if in == nil {
		return nil
	}
	out := new(ExternalPostgresList)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *ExternalPostgresList) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ExternalPostgresSpec) DeepCopyInto(out *ExternalPostgresSpec) {
	*out = *in
	out.Connection = in.Connection
	in.Kustomization.DeepCopyInto(&out.Kustomization)
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ExternalPostgresSpec.
func (in *ExternalPostgresSpec) DeepCopy() *ExternalPostgresSpec {
	if in == nil {
		return nil
	}
	out := new(ExternalPostgresSpec)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ExternalPostgresStatus) DeepCopyInto(out *ExternalPostgresStatus) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ExternalPostgresStatus.
func (in *ExternalPostgresStatus) DeepCopy() *ExternalPostgresStatus {
	if in == nil {
		return nil
	}
	out := new(ExternalPostgresStatus)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *KustomizationSpec) DeepCopyInto(out *KustomizationSpec) {
	*out = *in
	if in.CommonAnnotations != nil {
		in, out := &in.CommonAnnotations, &out.CommonAnnotations
		*out = make(map[string]string, len(*in))
		for key, val := range *in {
			(*out)[key] = val
		}
	}
	if in.CommonLabels != nil {
		in, out := &in.CommonLabels, &out.CommonLabels
		*out = make(map[string]string, len(*in))
		for key, val := range *in {
			(*out)[key] = val
		}
	}
	if in.ConfigMapGenerator != nil {
		in, out := &in.ConfigMapGenerator, &out.ConfigMapGenerator
		*out = make([]types.ConfigMapArgs, len(*in))
		for i := range *in {
			(*in)[i].DeepCopyInto(&(*out)[i])
		}
	}
	if in.Crds != nil {
		in, out := &in.Crds, &out.Crds
		*out = make([]string, len(*in))
		copy(*out, *in)
	}
	if in.GeneratorOptions != nil {
		in, out := &in.GeneratorOptions, &out.GeneratorOptions
		*out = new(types.GeneratorOptions)
		(*in).DeepCopyInto(*out)
	}
	if in.Images != nil {
		in, out := &in.Images, &out.Images
		*out = make([]types.Image, len(*in))
		copy(*out, *in)
	}
	if in.Patches != nil {
		in, out := &in.Patches, &out.Patches
		*out = make([]types.Patch, len(*in))
		for i := range *in {
			(*in)[i].DeepCopyInto(&(*out)[i])
		}
	}
	if in.PatchesJson6902 != nil {
		in, out := &in.PatchesJson6902, &out.PatchesJson6902
		*out = make([]types.PatchJson6902, len(*in))
		for i := range *in {
			(*in)[i].DeepCopyInto(&(*out)[i])
		}
	}
	if in.PatchesStrategicMerge != nil {
		in, out := &in.PatchesStrategicMerge, &out.PatchesStrategicMerge
		*out = make([]types.PatchStrategicMerge, len(*in))
		copy(*out, *in)
	}
	if in.Replicas != nil {
		in, out := &in.Replicas, &out.Replicas
		*out = make([]types.Replica, len(*in))
		copy(*out, *in)
	}
	if in.Resources != nil {
		in, out := &in.Resources, &out.Resources
		*out = make([]*types.Selector, len(*in))
		for i := range *in {
			if (*in)[i] != nil {
				in, out := &(*in)[i], &(*out)[i]
				*out = new(types.Selector)
				**out = **in
			}
		}
	}
	if in.SecretGenerator != nil {
		in, out := &in.SecretGenerator, &out.SecretGenerator
		*out = make([]types.SecretArgs, len(*in))
		for i := range *in {
			(*in)[i].DeepCopyInto(&(*out)[i])
		}
	}
	if in.Vars != nil {
		in, out := &in.Vars, &out.Vars
		*out = make([]types.Var, len(*in))
		copy(*out, *in)
	}
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new KustomizationSpec.
func (in *KustomizationSpec) DeepCopy() *KustomizationSpec {
	if in == nil {
		return nil
	}
	out := new(KustomizationSpec)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *PostgresConnection) DeepCopyInto(out *PostgresConnection) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new PostgresConnection.
func (in *PostgresConnection) DeepCopy() *PostgresConnection {
	if in == nil {
		return nil
	}
	out := new(PostgresConnection)
	in.DeepCopyInto(out)
	return out
}
